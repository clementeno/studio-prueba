import {defineArrayMember, defineField, defineType} from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      initialValue: "Home",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      description:
        "Orden manual de proyectos destacados en Home. Si no agregas ninguno, se usa featured=true en Project.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "project"}],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: "Home Page"}),
  },
});
