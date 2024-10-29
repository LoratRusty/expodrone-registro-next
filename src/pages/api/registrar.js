import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Obtener todas las conferencias y sus datos
        const { data, error } = await supabase
            .from('cupos')
            .select('id, conferencia, expositores, dia, cupos_disponibles');

        if (error) {
            console.error('Error al obtener las conferencias:', error);
            return res.status(500).json({ message: 'Error al obtener las conferencias' });
        }

        return res.status(200).json(data); // Enviar los datos de las conferencias al frontend
    }

    if (req.method === 'POST') {
        const { cedula, nombre, apellido, correo, telefono, conferencia } = req.body;

        // Verificar la disponibilidad de cupos para la conferencia seleccionada
        const { data: cupoData, error: cupoError } = await supabase
            .from('cupos')
            .select('cupos_disponibles')
            .eq('id', conferencia)
            .single();

        if (cupoError) {
            console.error('Error al verificar cupos:', cupoError);
            return res.status(500).json({ message: 'Error al verificar los cupos disponibles' });
        }

        if (!cupoData || cupoData.cupos_disponibles <= 0) {
            return res.status(400).json({ message: 'No hay cupos disponibles para esta conferencia' });
        }

        // Registrar al participante en la tabla de inscripciones
        const { error: inscripcionError } = await supabase
            .from('inscripciones')
            .insert([{ cedula, nombre, apellido, correo, telefono, conferencia }]);

        if (inscripcionError) {
            console.error('Error al registrar inscripción:', inscripcionError);
            return res.status(500).json({ message: 'Error al registrar la inscripción' });
        }

        // Actualizar el número de cupos disponibles
        const { error: actualizarCuposError } = await supabase
            .from('cupos')
            .update({ cupos_disponibles: cupoData.cupos_disponibles - 1 })
            .eq('id', conferencia);

        if (actualizarCuposError) {
            console.error('Error al actualizar cupos:', actualizarCuposError);
            return res.status(500).json({ message: 'Error al actualizar los cupos disponibles' });
        }

        return res.status(200).json({ message: 'Inscripción exitosa' });
    }

    // Método no permitido
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}
