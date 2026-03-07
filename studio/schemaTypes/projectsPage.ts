import {defineArrayMember, defineField, defineType} from "sanity";

export const projectsPageType = defineType({
  name: "projectsPage",
  title: "Projects Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      initialValue: "Proyectos",
    }),
    defineField({
      name: "casesLabel",
      title: "Cases Label",
      type: "string",
      initialValue: "Casos de estudio",
    }),
    defineField({
      name: "archivesLabel",
      title: "Archives Label",
      type: "string",
      initialValue: "Archivos",
    }),
    defineField({
      name: "defaultMode",
      title: "Default Mode",
      type: "string",
      options: {
        list: [
          {title: "Casos de estudio", value: "cases"},
          {title: "Archivos", value: "archives"},
        ],
      },
      initialValue: "cases",
    }),
    defineField({
      name: "allFilterLabel",
      title: 'Label for "All" filter',
      type: "string",
      initialValue: "Todos",
    }),
    defineField({
      name: "categories",
      title: "Filter Categories",
      description:
        "Orden manual de filtros para Archivos. Si queda vacio, se construye desde categorias usadas en proyectos.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "projectCategory"}],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: "Projects Page"}),
  },
});
