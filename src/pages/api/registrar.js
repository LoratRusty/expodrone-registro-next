import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { data, error } = await supabase.from('cupos').select('*');
        if (error) return res.status(500).json({ message: error.message });
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { cedula, nombre, apellido, correo, telefono, conferencia } = req.body;
        
        const { data: cupoData, error: cupoError } = await supabase
            .from('cupos')
            .select('disponibles')
            .eq('id', conferencia)
            .single();

        if (cupoError || !cupoData.disponibles) return res.status(400).json({ message: 'Cupos agotados' });

        const { error: inscripcionError } = await supabase
            .from('inscripciones')
            .insert([{ cedula, nombre, apellido, correo, telefono, conferencia }]);

        if (inscripcionError) return res.status(500).json({ message: inscripcionError.message });

        await supabase
            .from('cupos')
            .update({ disponibles: cupoData.disponibles - 1 })
            .eq('id', conferencia);

        return res.status(200).json({ message: 'Inscripción exitosa' });
    }
}
