<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { SelectionState } from '../models/dataModels'
	import type { BranchLeaf } from '../models/dataModels'
	import { setExpansionState, updateSelectionStateOfTree } from '../store/tree'

	const dispatch = createEventDispatcher()

	export let branch: BranchLeaf

	function onClickToggleExpansion(branch: BranchLeaf): void {
		if (branchHasChildren(branch)) {
			setExpansionState(branch.id, !branch.isExpanded)
		}
	}

	function onToggleSelectCheckbox(e: MouseEvent, branch: BranchLeaf): void {
		updateSelectionStateOfTree(branch, (e.target as HTMLInputElement).checked)
		dispatchSelectionChanged()
	}

	function dispatchSelectionChanged(): void {
		dispatch('selectionChanged')
	}

	const branchHasChildren = (branch: BranchLeaf): boolean =>
		branch.children && branch.children.length > 0
</script>

<div class="branch">
	<div class="leaf {branch.children && branch.children.length > 0 ? '' : 'spacer'}">
		{#if branch.children.length > 0}
			<button
				class="expansion-toggle {branch.isExpanded ? 'expanded' : ''}"
				on:click={() => onClickToggleExpansion(branch)}
			>
				{#if branch.isExpanded}-{:else}+{/if}
			</button>
		{/if}
		<label class="leaf-label"
			><input
				id={branch.id}
				class="leaf-checkbox"
				type="checkbox"
				checked={branch.selectionState === SelectionState.ALL}
				indeterminate={branch.selectionState === SelectionState.SOME}
				on:click={(e) => onToggleSelectCheckbox(e, branch)}
			/>
			{branch.label}
		</label>
	</div>
	{#if branch.children}
		<ul class={branch.isExpanded ? 'expanded' : 'hidden'}>
			{#each branch.children as child}
				<li>
					<svelte:self branch={child} on:selectionChanged={dispatchSelectionChanged} />
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	$active-color: #007bff;
	$font-size: 1rem;
	.branch {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.leaf {
			display: flex;
			align-items: center;
			width: 100%;
			border: 1px solid rgba(0, 0, 0, 0.1);
			background-color: white;
			min-height: 2rem;
			border-radius: 2px;
			margin: 1px;
			font-family: sans-serif;
			.expansion-toggle {
				border: none;
				background-color: transparent;
				font-size: 1.5rem;
				margin: 4px;
				width: 16px;
				height: 100%;
				&.expanded {
					transform: translateY(-2px);
				}
			}

			.leaf-label {
				display: flex;
				align-items: center;
				font-size: $font-size;
				.leaf-checkbox {
					margin: 4px;
					width: $font-size;
					height: $font-size;
				}
				&:hover {
					color: $active-color;
				}
			}
		}
		ul {
			margin: 0;
			list-style: none;
			user-select: none;
			width: 100%;
			&.expanded {
				display: block;
			}
			&.hidden {
				display: none;
			}
		}
	}
</style>
