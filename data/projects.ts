import type { StaticImageData } from "next/image";
import referenciotecaCover from "../app/proyectos/IMG/referencioteca.jpg";

export type Project = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  services: string[];
  tags: string[];
  year?: string;
  featured?: boolean;
  coverColor?: string;
  coverImage?: StaticImageData;
};

export const projects: Project[] = [
  {
    slug: "referencioteca",
    client: "REFERENCIOTECA",
    title: "Referencioteca",
    summary: "Proyecto de archivo web que visibiliza ex estudiantes UC.",
    services: ["Archivo Web", "Dirección de Arte", "Diseño y Desarrollo"],
    tags: ["Memoria Digital", "Ex Estudiantes UC", "Curaduría"],
    year: "2026",
    featured: true,
    coverColor: "#d8d8d8",
    coverImage: referenciotecaCover,
  },
  {
    slug: "casa-madera",
    client: "Casa Madera",
    title: "Casa Madera",
    summary: "Arquitectura y objetos para habitar mejor",
    services: ["Identidad", "Editorial", "Web"],
    tags: ["Arquitectura", "Diseño de Objetos", "Cultura de Marca"],
    year: "2023",
    featured: true,
    coverColor: "#e3e3e3",
  },
  {
    slug: "ruta-5",
    client: "Ruta 5",
    title: "Ruta 5",
    summary: "Señalética y narrativa para un viaje largo",
    services: ["Identidad", "Señalética", "Web"],
    tags: ["Sistema Vial", "Wayfinding", "Diseño Editorial"],
    year: "2022",
    featured: true,
    coverColor: "#e9e9e9",
  },
];
