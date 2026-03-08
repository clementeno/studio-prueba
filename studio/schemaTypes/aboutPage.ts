import {defineArrayMember, defineField, defineType} from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      initialValue: "About",
    }),
    defineField({
      name: "modules",
      title: "Modules",
      type: "array",
      description:
        "Estructura de la pagina About. Puedes combinar bloques 2+2 y media full width.",
      of: [
        defineArrayMember({type: "aboutSplitSection"}),
        defineArrayMember({type: "aboutFullMediaSection"}),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: "About Page"}),
  },
});
