import * as React from 'react'
import { Loader, Dropdown, Row, Button } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import ItemImage from 'components/ItemImage'
import ItemProvider from 'components/ItemProvider'
import ConfirmDelete from 'components/ConfirmDelete'
import { isEqual } from 'lib/address'
import { getMissingBodyShapeType } from 'modules/item/utils'
import { Item, ItemRarity, ITEM_DESCRIPTION_MAX_LENGTH, ITEM_NAME_MAX_LENGTH, WearableCategory } from 'modules/item/types'
import Collapsable from './Collapsable'
import Input from './Input'
import Select from './Select'
import MultiSelect from './MultiSelect'
import Tags from './Tags'
import { State, Props } from './RightPanel.types'
import './RightPanel.css'

export default class RightPanel extends React.PureComponent<Props, State> {
  timeout: NodeJS.Timer | null = null
  state: State = { item: null, isDirty: false }

  componentDidUpdate = (prevProps: Props, _: State) => {
    // @TODO isDirty should be managed by each property with a utils method
    if (prevProps.selectedItemId !== this.props.selectedItemId) {
      return this.setState({ item: null, isDirty: false })
    }

    const selectedItem = this.getSelectedItem()
    if (!this.state.item && selectedItem) {
      return this.setState({ item: selectedItem })
    }
  }

  getSelectedItem = () => {
    const { items, selectedItemId } = this.props
    return items.find(item => item.id === selectedItemId) || null
  }

  handleDeleteItem = () => {
    const { onDeleteItem } = this.props
    const { item } = this.state
    onDeleteItem(item!)
  }

  handleAddRepresentationToItem = () => {
    const { onOpenModal } = this.props
    const { item } = this.state
    onOpenModal('CreateItemModal', { addRepresentationTo: item! })
  }

  handleChange = (newItem: Item) => {
    this.setState({ item: newItem, isDirty: true })
  }

  handleOnSaveItem = () => {
    const { item } = this.state
    if (item) {
      this.props.onSaveItem(item, {})
    }
  }

  handleOnResetItem = () => {
    const selectedItem = this.getSelectedItem()
    return this.setState({ item: selectedItem, isDirty: false })
  }

  handleRemoveFromCollection = () => {
    const { onSetCollection } = this.props
    const { item } = this.state
    if (item) {
      onSetCollection(item, null)
    }
  }

  render() {
    const { selectedItemId, address = '' } = this.props
    const { item: selectedItem, isDirty } = this.state

    const isOwner = selectedItem && isEqual(selectedItem.owner, address)

    const categories = Object.values(WearableCategory)
    const rarities = Object.values(ItemRarity)

    return (
      <div className="RightPanel">
        <ItemProvider id={selectedItemId}>
          {(item, _collection, isLoading) =>
            !item || isLoading ? (
              <Loader size="massive" active />
            ) : (
              <>
                <div className="header">
                  <div className="title">{t('item_editor.right_panel.properties')}</div>
                  {isOwner && selectedItem && !selectedItem.isPublished ? (
                    <Dropdown trigger={<div className="actions" />} inline direction="left">
                      <Dropdown.Menu>
                        {getMissingBodyShapeType(selectedItem) !== null ? (
                          <Dropdown.Item
                            text={t('item_detail_page.add_representation', {
                              bodyShape: t(`body_shapes.${getMissingBodyShapeType(selectedItem)}`).toLowerCase()
                            })}
                            onClick={this.handleAddRepresentationToItem}
                          />
                        ) : null}
                        {item!.collectionId ? (
                          <Dropdown.Item text={t('collection_item.remove_from_collection')} onClick={this.handleRemoveFromCollection} />
                        ) : null}
                        <ConfirmDelete
                          name={selectedItem.name}
                          onDelete={this.handleDeleteItem}
                          trigger={<Dropdown.Item text={t('global.delete')} />}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : null}
                </div>
                <Collapsable item={selectedItem} label={t('item_editor.right_panel.details')}>
                  {item => (
                    <div className="details">
                      <ItemImage item={item} hasBadge={true} badgeSize="small" />
                      <div className="metrics">
                        <div className="metric triangles">{t('model_metrics.triangles', { count: item.metrics.triangles })}</div>
                        <div className="metric materials">{t('model_metrics.materials', { count: item.metrics.materials })}</div>
                        <div className="metric textures">{t('model_metrics.textures', { count: item.metrics.textures })}</div>
                      </div>
                    </div>
                  )}
                </Collapsable>
                <Collapsable item={selectedItem} label={t('item_editor.right_panel.basics')}>
                  {item => (
                    <>
                      <Input
                        itemId={item.id}
                        label={t('global.name')}
                        value={item.name}
                        disabled={item.isPublished || !isOwner}
                        maxLength={ITEM_NAME_MAX_LENGTH}
                        onChange={name => this.handleChange({ ...item, name })}
                      />
                      <Input
                        itemId={item.id}
                        label={t('global.description')}
                        value={item.description}
                        disabled={item.isPublished || !isOwner}
                        maxLength={ITEM_DESCRIPTION_MAX_LENGTH}
                        onChange={description => this.handleChange({ ...item, description })}
                      />
                      <Select<WearableCategory>
                        itemId={item.id}
                        label={t('global.category')}
                        value={item.data.category}
                        options={categories.map(value => ({ value, text: t(`wearable.category.${value}`) }))}
                        disabled={item.isPublished || !isOwner}
                        onChange={category => this.handleChange({ ...item, data: { ...item.data, category } })}
                      />
                      <Select<ItemRarity>
                        itemId={item.id}
                        label={t('global.rarity')}
                        value={item.rarity}
                        options={rarities.map(value => ({ value, text: t(`wearable.rarity.${value}`) }))}
                        disabled={item.isPublished || !isOwner}
                        onChange={rarity => this.handleChange({ ...item, rarity })}
                      />
                    </>
                  )}
                </Collapsable>
                <Collapsable item={selectedItem} label={t('item_editor.right_panel.overrides')}>
                  {item => (
                    <>
                      <MultiSelect<WearableCategory>
                        itemId={item.id}
                        label={t('item_editor.right_panel.replaces')}
                        value={item.data.replaces}
                        options={categories.map(value => ({ value, text: t(`wearable.category.${value}`) }))}
                        disabled={item.isPublished || !isOwner}
                        onChange={replaces =>
                          this.handleChange({
                            ...item,
                            data: {
                              ...item.data,
                              replaces,
                              representations: item.data.representations.map(representation => ({
                                ...representation,
                                overrideReplaces: replaces
                              }))
                            }
                          })
                        }
                      />
                      <MultiSelect<WearableCategory>
                        itemId={item.id}
                        label={t('item_editor.right_panel.hides')}
                        value={item.data.hides}
                        options={categories.map(value => ({ value, text: t(`wearable.category.${value}`) }))}
                        disabled={item.isPublished || !isOwner}
                        onChange={hides =>
                          this.handleChange({
                            ...item,
                            data: {
                              ...item.data,
                              hides,
                              representations: item.data.representations.map(representation => ({
                                ...representation,
                                overrideHides: hides
                              }))
                            }
                          })
                        }
                      />
                    </>
                  )}
                </Collapsable>
                <Collapsable item={selectedItem} label={t('item_editor.right_panel.tags')}>
                  {item => (
                    <Tags
                      itemId={item.id}
                      value={item.data.tags}
                      onChange={tags => this.handleChange({ ...item, data: { ...item.data, tags } })}
                      isDisabled={item.isPublished || !isOwner}
                    />
                  )}
                </Collapsable>
                <Row>
                  <Button secondary disabled={!isDirty} onClick={this.handleOnResetItem}>
                    {t('global.cancel')}
                  </Button>
                  <Button primary disabled={!isDirty} onClick={this.handleOnSaveItem}>
                    {t('global.submit')}
                  </Button>
                </Row>
              </>
            )
          }
        </ItemProvider>
      </div>
    )
  }
}
