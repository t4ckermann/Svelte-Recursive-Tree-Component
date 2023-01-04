import { SelectionState } from '../models/dataModels'
import { writable } from 'svelte/store'
import type { BranchLeaf } from '../models/dataModels'

export const tree = writable<BranchLeaf[]>([])

export function setExpansionState(id: string, isExpanded: boolean): void {
	tree.update((tree) => {
		const node = findNode(tree, id)
		if (node) {
			node.isExpanded = isExpanded
		}
		return tree
	})
}

export function updateSelectionStateOfTree(branch: BranchLeaf, checked: boolean): void {
	tree.update((tree) => {
		const node = findNode(tree, branch.id)
		if (node && node.children && node.children.length > 0) {
			if (checked) {
				// all children and children of children are selected
				node.selectionState = SelectionState.ALL
				node.children.forEach((child) => {
					updateSelectionStateOfTree(child, true)
				})
			} else {
				// all children and children of children are deselected
				node.selectionState = SelectionState.NONE
				node.children.forEach((child) => {
					updateSelectionStateOfTree(child, false)
				})
			}
		} else if (node) {
			node.selectionState = checked ? SelectionState.ALL : SelectionState.NONE
		}
		return updateTreeFromChildren(tree)
	})
}

export function updateTreeFromChildren(tree: BranchLeaf[]): BranchLeaf[] {
	return tree.map((item) => {
		if (item.children && item.children.length > 0) {
			const children = updateTreeFromChildren(item.children)
			const allChildrenSelected = children.every(
				(child) => child.selectionState === SelectionState.ALL
			)
			const someChildrenSelected = children.some(
				(child) =>
					child.selectionState === SelectionState.SOME ||
					(child.selectionState === SelectionState.ALL && !allChildrenSelected)
			)
			return {
				id: item.id,
				label: item.label,
				children: children,
				selectionState: allChildrenSelected
					? SelectionState.ALL
					: someChildrenSelected
					? SelectionState.SOME
					: SelectionState.NONE,
				isExpanded: allChildrenSelected ? true : item.isExpanded || false
			}
		} else {
			return item
		}
	})
}

function findNode(tree: BranchLeaf[], id: string): BranchLeaf | undefined {
	for (const node of tree) {
		if (node.id === id) {
			return node
		} else if (node.children && node.children.length > 0) {
			const childNode = findNode(node.children, id)
			if (childNode) {
				return childNode
			}
		}
	}
}
