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
		'normalizedName',
		'node',
	],
	content: {
		dl: [
			[
				'name',
				'normalizedName',
				'node',
				{
					label: 'label name/hash',
				},
				'$parent',
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
	lists: [
		{
			id: 'subdomains',
			label: 'subdomains',
			field: '$$subdomains',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'records',
			label: 'records',
			field: '$$records',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'reverse-records',
			label: 'reverse records',
			field: '$$reverseRecords',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
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
