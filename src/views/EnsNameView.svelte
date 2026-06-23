<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'name',
			{
				label: 'normalized name',
			},
			'node',
		],
		content: {
			dl: [
				[
					'name',
					{
						label: 'normalized name',
					},
					'node',
					{
						label: 'label name/hash',
					},
					{
						label: 'parent',
					},
					{
						label: 'latest owner/resolver snapshot',
					},
					{
						label: 'latest reverse-record status',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Name snapshots',
					items: [
						{
							label: 'timestamped ENS name registry/index state',
						},
					],
				},
				{
					label: 'Records',
					items: [
						{
							label: 'ENS records grouped by addr/text/contenthash/ABI/multicoin',
						},
					],
				},
				{
					label: 'Subdomains',
					items: [
						{
							label: 'ENS subdomain rows',
						},
					],
				},
				{
					label: 'Reverse records',
					items: [
						{
							label: 'ENS reverse-record rows',
						},
					],
				},
				{
					label: 'Linked accounts',
					items: [
						{
							label: 'EVM account refs from latest snapshot/records',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EnsName>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EnsName}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
