import path, { dirname } from "path";
import fs from "fs-extra";

export const cacheDirHandler = ()=>{
    const cacheDirPath = path.join('./store/cache')
    if(!fs.existsSync(cacheDirPath)){
        fs.mkdirSync(cacheDirPath)
    }
    return cacheDirPath
}