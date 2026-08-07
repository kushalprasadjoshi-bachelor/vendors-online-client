export const fileToDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(reader.error)
  reader.readAsDataURL(file)
})

export const filesToDataUrls = async (fileList) => (
  Promise.all(Array.from(fileList || []).map(fileToDataUrl))
)
