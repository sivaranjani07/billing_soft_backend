import fs from 'fs';
import path from 'path';

const name = process.argv[2]

if (!name) {
    process.exit(1);
}

const pascalCaseName = name.charAt(0).toUpperCase() + name.slice(1);

//folder path

const dtoFolder = path.join(__dirname, '../src/dtos')
const entityFolder = path.join(__dirname, '../src/entity')
const controllerFolder = path.join(__dirname, '../src/controllers')
const routesFolder = path.join(__dirname, '../src/routes')


//DTO template
const dtoTemplate = `import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ${pascalCaseName}DTO {
    @IsNotEmpty()
    @IsString()
    name!: string;
    
    @IsEmail()
    email!: string;
    
    // Add other properties and validation decorators as needed
}
`;

//Controller template
const controllerTemplate = `import { NextFunction, Request, Response } from "express";`

//Router template
const routerTemplate = `import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
})
export default router;`

//Entity template
const entityTemplate = `import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
@Entity()  
export class ${pascalCaseName} { 
} `

function createFile(folder: string, filename: string, content: string) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    const filepath = path.join(folder, filename);
    fs.writeFileSync(filepath, content, { encoding: 'utf8' });
    console.log(`✅ Created: ${filepath}`);
}


createFile(dtoFolder, `${pascalCaseName}DTO.ts`, dtoTemplate);
createFile(controllerFolder, `${name}Controller.ts`, controllerTemplate);
createFile(entityFolder, `${pascalCaseName}.ts`, entityTemplate);
createFile(routesFolder, `${name}.ts`, routerTemplate);
