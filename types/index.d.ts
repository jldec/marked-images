declare module "marked-images" {
  import { Renderer } from "marked";
  
  interface MarkedImagesOptions {
    fqImages?: {
      route?: string;
      url: string;
    };
    fqLinks?: string;
    relPath?: string;
    xhtml?: boolean;
  }
  
  function markedImages(opts?: MarkedImagesOptions): { renderer: Renderer<string> };
  
  export = markedImages;
}
