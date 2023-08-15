type TitleMetadata =
  | undefined
  | string
  | {
      absolute: string;
    };

export function pageTitle(title: TitleMetadata): string {

  const base = "%s | Typer";

  if (title instanceof Object) {
    if (title.absolute) {
      return title.absolute;
    }
  } else if (typeof title === "string") {
    if (title) {
      return base.replace("%s", title);
    }
  }

  return "Typer";
}
