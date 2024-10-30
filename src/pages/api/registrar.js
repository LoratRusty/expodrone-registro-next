import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    try {
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variables de entorno Supabase URL o ANON_KEY no están configuradas.');
        }

        // Obtener la lista de conferencias o la lista de inscritos
        if (req.method === 'GET') {
            if (req.query.inscritos) {
                const { data: inscripciones, error: errorInscripciones } = await supabase
                    .from('inscripciones')
                    .select('cedula, nombre, apellido, correo, telefono, conferencias');

                if (errorInscripciones) throw new Error(`Error al obtener inscripciones: ${errorInscripciones.message}`);

                return res.status(200).json(inscripciones);
            }

            // Obtener lista de conferencias si no hay query de `inscritos`
            const { data, error } = await supabase
                .from('cupos')
                .select('id, conferencia, expositores, dia, cupos_disponibles');

            if (error) throw new Error(`Error al obtener conferencias: ${error.message}`);
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const { cedula, nombre, apellido, correo, telefono, conferencias } = req.body;

            if (!Array.isArray(conferencias) || conferencias.length === 0) {
                return res.status(400).json({ message: 'Debes seleccionar al menos una conferencia' });
            }

            if (conferencias.length > 3) {
                return res.status(400).json({ message: 'No puedes seleccionar más de 3 conferencias' });
            }

            // Verificar si la cédula ya está registrada
            const { data: registroExistente, error: errorVerificacion } = await supabase
                .from('inscripciones')
                .select('cedula')
                .eq('cedula', cedula)
                .single();

            if (errorVerificacion && errorVerificacion.code !== 'PGRST116') throw errorVerificacion;

            if (registroExistente) {
                return res.status(400).json({ message: 'La cédula ya se encuentra registrada' });
            }

            // Unir los IDs de las conferencias en una cadena separada por comas
            const idsConferencias = conferencias.join(',');

            // Verificar disponibilidad de cupos para todas las conferencias seleccionadas
            const { data: cuposDisponibles, error: cupoError } = await supabase
                .from('cupos')
                .select('id, cupos_disponibles')
                .in('id', conferencias);

            if (cupoError) throw new Error(`Error al verificar cupos: ${cupoError.message}`);

            const sinCupo = cuposDisponibles.find(cupo => cupo.cupos_disponibles <= 0);
            if (sinCupo) {
                return res.status(400).json({ message: `No hay cupos disponibles para la conferencia con ID ${sinCupo.id}` });
            }

            // Registrar el participante en la tabla de inscripciones con los IDs de las conferencias
            const { error: inscripcionError } = await supabase
                .from('inscripciones')
                .insert([{ cedula, nombre, apellido, correo, telefono, conferencias: idsConferencias }]);

            if (inscripcionError) throw new Error(`Error al registrar inscripción: ${inscripcionError.message}`);

            // Actualizar el número de cupos disponibles para cada conferencia seleccionada
            for (const conferencia of conferencias) {
                const cupoActual = cuposDisponibles.find(cupo => cupo.id === conferencia);
                const { error: actualizarCuposError } = await supabase
                    .from('cupos')
                    .update({ cupos_disponibles: cupoActual.cupos_disponibles - 1 })
                    .eq('id', conferencia);

                if (actualizarCuposError) throw new Error(`Error al actualizar cupos: ${actualizarCuposError.message}`);
            }

            return res.status(200).json({ message: 'Inscripción exitosa a las conferencias seleccionadas' });
        }

        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    } catch (error) {
        console.error('Error en el handler API:', error.message);
        return res.status(500).json({ message: `Error del servidor: ${error.message}` });
    }
}
