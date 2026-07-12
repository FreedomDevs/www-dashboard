// @ts-ignore
const projectRoot = process.cwd();

export default (id: string) => {
  id = id.replace(/^\0/, '')
  // @ts-ignore
  if (id.startsWith(process.cwd())) {
    id = id.slice(projectRoot.length + 1)
  }
  if (id.startsWith("node_modules/.pnpm")) {
    const searchTerm = "node_modules";
    const index = id.lastIndexOf(searchTerm);

    id = index !== -1 ? id.substring(index) : id;
  }

  //
}
