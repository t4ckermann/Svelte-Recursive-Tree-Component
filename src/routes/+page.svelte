<script lang="ts">
	import TreeComponent from '../components/TreeComponent.svelte'
	import type { Data } from '../models/dataModels'

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
	]
</script>

<TreeComponent permissionsData={exampleData} />
