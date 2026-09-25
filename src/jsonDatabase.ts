import fs from 'fs';
import { DataUsuario, Metricas } from './interfaces';

export class JsonDatabase {
    private rutaArchivo: string;

    /**
     * Inicializa el motor de base de datos JSON corporativo.
     * @param ruta Ruta absoluta hacia el archivo .json (puedes usar path.join)
     */
    constructor(ruta: string) {
        this.rutaArchivo = ruta;
    }

    /** Retorna el arreglo completo de usuarios desde el archivo JSON */
    public obtenerUsuarios(): DataUsuario[] {
        if (!fs.existsSync(this.rutaArchivo)) {
            fs.writeFileSync(this.rutaArchivo, '[]', 'utf-8');
            return [];
        }
        const dataRaw = fs.readFileSync(this.rutaArchivo, 'utf-8');
        return JSON.parse(dataRaw) as DataUsuario[];
    }

    private guardarEnDisco(datos: DataUsuario[]): void {
        fs.writeFileSync(this.rutaArchivo, JSON.stringify(datos, null, 2), 'utf-8');
    }

    /** Inserta un nuevo usuario al archivo JSON inyectando automáticamente fecha y hora actuales */
    public insertarUsuario(nuevoUsuario: DataUsuario): void {
        const usuarios = this.obtenerUsuarios();
        
        const ahora = new Date();
        nuevoUsuario.fdfecha = ahora.toLocaleDateString();
        nuevoUsuario.fchora = ahora.toLocaleTimeString();

        usuarios.push(nuevoUsuario);
        this.guardarEnDisco(usuarios);
    }

    /** 
     * Elimina múltiples usuarios indicando un arreglo de IDs.
     * @returns Un arreglo con los IDs que quedaron libres/sin uso.
     */
    public eliminarUsuariosPorIds(idsAEliminar: number[]): number[] {
        const usuariosOriginales = this.obtenerUsuarios();
        const usuariosFiltrados = usuariosOriginales.filter((u) => !idsAEliminar.includes(u.fiid));
        
        this.guardarEnDisco(usuariosFiltrados);
        return idsAEliminar;
    }

    /** Genera estadísticas globales del archivo recorriendo el arreglo una sola vez */
    public generarMetricas(): Metricas {
        const usuarios = this.obtenerUsuarios();
        
        return usuarios.reduce((acc: Metricas, x: DataUsuario) => {
            acc.totalusuarios += 1;
            acc.totaledades += x.fiidedad;

            if (x.fiidedad < 18) {
                acc.totalmenores += 1;
                acc.totedadesmen += x.fiidedad;
            } else {
                acc.totalmayores += 1;
                acc.totedadesmay += x.fiidedad;
            }
            return acc;
        }, {
            totalusuarios: 0,
            totalmenores: 0,
            totalmayores: 0,
            totedadesmen: 0,
            totedadesmay: 0,
            totaledades: 0
        });
    }
}
