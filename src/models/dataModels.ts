export enum SelectionState {
	NONE = 0,
	SOME = 1,
	ALL = 2
}
export interface Data {
	id: string
	label: string
	children?: Data[]
	isSelected?: boolean
}

export interface BranchLeaf {
	id: string
	label: string
	children: BranchLeaf[]
	isExpanded?: boolean
	selectionState?: SelectionState
}

export function mapDataToBranchLeaf(data: Data[]): BranchLeaf[] {
	return data.map((item) => {
		if (item.children && item.children.length > 0) {
			const children = mapDataToBranchLeaf(item.children)
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
				isExpanded: allChildrenSelected || someChildrenSelected
			}
		} else {
			return {
				id: item.id,
				label: item.label,
				children: [],
				isExpanded: false,
				selectionState: item.isSelected ? SelectionState.ALL : SelectionState.NONE
			}
		}
	})
}

export function mapBranchLeafToData(tree: BranchLeaf[]): Data[] {
	return tree.map((item) => {
		if (item.children && item.children.length > 0) {
			return {
				id: item.id,
				label: item.label,
				children: mapBranchLeafToData(item.children),
				isSelected:
					item.selectionState === SelectionState.ALL || item.selectionState === SelectionState.SOME
			}
		} else {
			return {
				id: item.id,
				label: item.label,
				children: [],
				isSelected: item.selectionState === SelectionState.ALL
			}
		}
	})
}
