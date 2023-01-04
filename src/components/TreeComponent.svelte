<script lang="ts">
	import { mapDataToBranchLeaf } from '../models/dataModels'
	import type { Data } from '../models/dataModels'
	import { onMount } from 'svelte/internal'
	import RecursiveTreeBranch from '../components/RecursiveTreeBranch.svelte'
	import { tree as storedTree } from '../store/tree'

	export let permissionsData: Data[] = []

	onMount(() => {
		setTree()
	})

	function setTree(): void {
		$storedTree = mapDataToBranchLeaf(permissionsData)
	}

	function onSelectionChanged(): void {
		permissionsData = mapDataToBranchLeaf($storedTree)
	}
</script>

{#if permissionsData.length === 0}
	No data to display.
{:else}
	<div class="tree-component">
		{#each $storedTree as branch}
			<RecursiveTreeBranch {branch} on:selectionChanged={onSelectionChanged} />
		{/each}
	</div>
{/if}

<style lang="scss">
	.tree-component {
		border: 1px solid rgba(0, 0, 0, 0.1);
		background-color: rgba(0, 0, 0, 0.025);
		border-radius: 4px;
		padding: 8px;
	}
</style>
