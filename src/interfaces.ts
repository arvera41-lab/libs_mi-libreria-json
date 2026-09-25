/** Estructura base de datos JSON de la empresa */
export interface IJSONData {
    fiid: number;
    fcnombre: string;
    fiidedad: number;
    fiidstatus: number;
}

/** Estructura extendida de usuario con campos calculados por la librería */
export interface DataUsuario extends IJSONData {
    fdfecha?: string;
    fchora?: string;
    fcclasificacion?: string;
    fcdepartamento?: string;
}

/** Estructura para el objeto acumulador de estadísticas globales */
export interface Metricas {
    totalusuarios: number;
    totalmenores: number;
    totalmayores: number;
    totedadesmen: number;
    totedadesmay: number;
    totaledades: number;
}
