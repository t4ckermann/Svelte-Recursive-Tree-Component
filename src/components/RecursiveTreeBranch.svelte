<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { SelectionState } from '../models/dataModels';
	import type { BranchLeaf } from '../models/dataModels';
	import { setExpansionState, updateSelectionStateOfTree } from '../store/tree';

	const dispatch = createEventDispatcher();

	export let branch: BranchLeaf;

	function onClickToggleExpansion(branch: BranchLeaf): void {
		if (branchHasChildren(branch)) {
			setExpansionState(branch.id, !branch.isExpanded);
		}
	}

	function onToggleSelectCheckbox(e: MouseEvent, branch: BranchLeaf): void {
		updateSelectionStateOfTree(branch, (e.target as HTMLInputElement).checked);
		dispatchSelectionChanged();
	}

	function dispatchSelectionChanged(): void {
		dispatch('selectionChanged');
	}

	const branchHasChildren = (branch: BranchLeaf): boolean =>
		branch.children && branch.children.length > 0;
</script>

<div class="branch">
	<div class="leaf {branch.children && branch.children.length > 0 ? '' : 'spacer'}">
		{#if branch.children.length > 0}
			<button class="expansion-toggle" on:click={() => onClickToggleExpansion(branch)}>
				{#if branch.isExpanded}-{:else}+{/if}
			</button>
		{/if}
		<input
			class="checkbox"
			type="checkbox"
			checked={branch.selectionState === SelectionState.ALL}
			indeterminate={branch.selectionState === SelectionState.SOME}
			on:click={(e) => onToggleSelectCheckbox(e, branch)}
		/>
		<span class="label"><b>{branch.label}</b> ({branch.id}) </span>
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
				margin-left: 8px;
				width: 16px;
				height: 100%;
			}
			.checkbox {
				margin: 0.5rem;
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
