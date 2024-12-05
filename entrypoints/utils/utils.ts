
export async function readFile(f: File): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                resolve(e.target.result as string);
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.readAsDataURL(f);
    });
}
