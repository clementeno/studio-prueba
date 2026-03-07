import type {StructureResolver} from "sanity/structure";

const hiddenDocTypes = new Set(["homePage", "projectsPage"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido")
    .items([
      S.listItem()
        .title("Home Page")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Projects Page")
        .id("projectsPage")
        .child(S.document().schemaType("projectsPage").documentId("projectsPage")),
      S.divider(),
      S.documentTypeListItem("projectCategory").title("Project Categories"),
      S.documentTypeListItem("project").title("Projects"),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId();
        return id ? !hiddenDocTypes.has(id) && !["project", "projectCategory"].includes(id) : false;
      }),
    ]);
