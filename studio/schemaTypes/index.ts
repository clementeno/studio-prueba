import {homePageType} from "./homePage";
import {projectType} from "./project";
import {projectCategoryType} from "./projectCategory";
import {projectsPageType} from "./projectsPage";
import {projectEmbedSectionType} from "./sections/projectEmbedSection";
import {projectGalleryImageType} from "./sections/projectGalleryImage";
import {projectGallerySectionType} from "./sections/projectGallerySection";
import {projectImageSectionType} from "./sections/projectImageSection";
import {projectTextSectionType} from "./sections/projectTextSection";
import {projectVideoSectionType} from "./sections/projectVideoSection";

export const schemaTypes = [
  homePageType,
  projectsPageType,
  projectCategoryType,
  projectType,
  projectTextSectionType,
  projectImageSectionType,
  projectVideoSectionType,
  projectGalleryImageType,
  projectGallerySectionType,
  projectEmbedSectionType,
];
