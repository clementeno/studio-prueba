import {defineArrayMember, defineField, defineType} from "sanity";

export const projectClosingSectionType = defineType({
  name: "projectClosingSection",
  title: "Closing Section",
  type: "object",
  fields: [
    defineField({
      name: "leftText",
      title: "Left Column Text",
      type: "text",
      rows: 18,
      description: "Texto final largo de la columna izquierda.",
    }),
    defineField({
      name: "rightBlocks",
      title: "Right Column Blocks",
      type: "array",
      of: [defineArrayMember({type: "projectClosingBlock"})],
      description: "Ejemplos: Creditos, Tipografia, Produccion, etc.",
    }),
  ],
  preview: {
    select: {
      leftText: "leftText",
      rightBlocks: "rightBlocks",
    },
    prepare: ({leftText, rightBlocks}) => ({
      title: "Closing Section",
      subtitle: `${leftText ? "Texto" : "Sin texto"} · ${
        Array.isArray(rightBlocks) ? rightBlocks.length : 0
      } bloques`,
    }),
  },
});
