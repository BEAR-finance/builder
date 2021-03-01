import { utils } from 'decentraland-commons'
import { AuthIdentity } from 'dcl-crypto'
import { getContentsStorageUrl } from 'lib/api/builder'
import { saveUnpublishedItem } from 'modules/item/sagas'
import { getCatalystPointer } from 'modules/item/utils'
import { buildDeployData, deploy, makeContentFiles, EntityType } from 'modules/deployment/contentUtils'
import { PEER_URL } from 'lib/api/peer'
import { Collection } from 'modules/collection/types'
import { IMAGE_PATH, Item } from './types'
import { generateImage } from './utils'

export async function deployContents(identity: AuthIdentity, collection: Collection, item: Item) {
  const pointer = getCatalystPointer(collection, item)
  const files = await getFiles(item.contents)
  const image = await generateImage(item)
  const contentFiles = await makeContentFiles({ ...files, [IMAGE_PATH]: image })
  const metadata = { ...(utils.omit(item, ['contents']) as Omit<Item, 'contents'>), image: IMAGE_PATH }
  const [data] = await buildDeployData(EntityType.WEARABLE, identity, [pointer], metadata, contentFiles)
  await deploy(PEER_URL, data)

  // @TODO: Revisit this because if it is in the catalyst we shouldn't update it
  const newItem = { ...item, inCatalyst: true }
  if (!item.isPublished) {
    await saveUnpublishedItem(newItem)
  }

  return newItem
}

async function getFiles(contents: Record<string, string>) {
  const promises = Object.keys(contents).map(path => {
    const url = getContentsStorageUrl(contents[path])

    return fetch(url)
      .then(resp => resp.blob())
      .then(blob => ({ path, blob }))
  })

  const results = await Promise.all(promises)

  return results.reduce<Record<string, Blob>>((files, file) => {
    files[file.path] = file.blob
    return files
  }, {})
}
