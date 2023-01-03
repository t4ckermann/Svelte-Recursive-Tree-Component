<script lang="ts">
	import { mapDataToBranchLeaf } from '../models/dataModels';
	import type { Data } from '../models/dataModels';
	import { onMount } from 'svelte/internal';
	import RecursiveTreeBranch from '../components/RecursiveTreeBranch.svelte';
	import { tree as storedTree } from '../store/tree';

	export let loading: boolean;
	export let permissionsData: Data[] = [];

	const exampleData: Data[] = [
		{
			label: 'Branch',
			id: '1',
			isSelected: true,
			children: [
				{
					label: 'Branch',
					id: '1.1',
					isSelected: false,
					children: [
						{
							label: 'Branch',
							id: '1.1.1',
							isSelected: false,
							children: [
								{
									label: 'Leaf',
									id: '1.1.1.1',
									isSelected: true
								},
								{
									label: 'Leaf',
									id: '1.1.1.2',
									isSelected: false
								}
							]
						}
					]
				}
			]
		},
		{
			label: 'Branch',
			id: '2',
			isSelected: true,
			children: [
				{
					label: 'Branch',
					id: '2.1',
					isSelected: false,
					children: [
						{
							label: 'Branch',
							id: '2.1.1',
							isSelected: false,
							children: [
								{
									label: 'Branch',
									id: '2.1.1.1',
									isSelected: true,
									children: [
										{
											label: 'Leaf',
											id: '2.1.1.1.1',
											isSelected: true
										}
									]
								},
								{
									label: 'Leaf',
									id: '2.1.1.2',
									isSelected: false
								}
							]
						}
					]
				}
			]
		}
	];

	onMount(() => {
		setTree();
	});

	function setTree(): void {
		$storedTree = mapDataToBranchLeaf(exampleData);
		loading = false;
	}

	function onSelectionChanged(): void {
		permissionsData = mapDataToBranchLeaf($storedTree);
	}
</script>

<div class="tree-component flex" data-testid="tree-component">
	{#each $storedTree as branch}
		<RecursiveTreeBranch {branch} on:selectionChanged={onSelectionChanged} />
	{/each}
</div>

<style lang="scss">
	.tree-component {
		border: 1px solid rgba(0, 0, 0, 0.1);
		background-color: rgba(0, 0, 0, 0.025);
		border-radius: 4px;
		padding: 8px;
	}
</style>
