import * as fs from "fs";
import * as Handlebars from "handlebars";
import * as path from "path";

export function renderTemplate(
    templateName: string,
    variables: Record<string, any>,
) {
    const filePath = path.join(
        __dirname,
        "../infra/mail/templates",
        `${templateName}.hbs`,
    );

    const templateFile = fs.readFileSync(filePath, "utf-8");
    const compiled = Handlebars.compile(templateFile);
    return compiled(variables);
}
