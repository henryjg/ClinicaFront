// src/utils/FechaFormatter.ts
export class CleanLink {

    static LinkUrl(texto:string) {
        return texto
            .toLowerCase() // Convertir a minúsculas
            .normalize("NFD") // Descomponer caracteres con tilde
            .replace(/[\u0300-\u036f]/g, "") // Eliminar diacríticos (tildes)
            .replace(/ñ/g, "n") // Reemplazar ñ por n
            .replace(/\s+/g, "-") // Reemplazar espacios en blanco por "-"
            .replace(/[^a-z0-9-]/g, "") // Eliminar caracteres especiales excepto "-"
            .replace(/-+/g, "-") // Evitar múltiples guiones seguidos
            .trim(); // Eliminar espacios al inicio y final (por si acaso)
    }
 
}
