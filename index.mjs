import {readdir, readFile} from "fs/promises";
import path from "path";

const allCatKeyword = "__all";

// caching a list of cat pics - so we don't re-read it every time
const listCats = (()=>{
	const defaultCatDir = path.resolve(import.meta.dirname, "./cat.pics");
	const catLists = {};
	catLists[allCatKeyword] = [];
	_listCats(defaultCatDir); // loading default cats
	async function _listCats(catDir){
		catDir ??= defaultCatDir;
		if(catDir === allCatKeyword){
			return catLists[allCatKeyword];
		}
		if(catLists[catDir]){
			return catLists[catDir];
		}
		const fPics = await readdir(catDir);
		if(!fPics.length){
			throw new Error("No cat pics were found in Directory '", catDir, "'");
		}
		catLists[catDir] = fPics.map(f=>path.resolve(catDir, f));
		catLists["__all"].push(...catLists[catDir]);
		return catLists[catDir];
	}
	return _listCats;
})();


export async function catMiAll(){
	return await catMi(allCatKeyword)
}

export async function addCatsFromDir(catDir){
	await listCats(catDir);
}

export async function catMi(catDir){
	const picArr = await listCats(catDir);
	const randomF = picArr[Math.floor(Math.random() * picArr.length)];
	const imgBuffer = await readFile(randomF);
	return imgBuffer.toString("base64");
}