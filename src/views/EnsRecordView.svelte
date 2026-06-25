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
		'$name',
		'recordKey',
		'recordKind',
	],
	content: {
		dl: [
			[
				'$name',
				'recordKey',
				'recordKind',
				'coinType',
				{
					label: 'latest value',
				},
				{
					label: 'latest block/source',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'History',
				items: [
					{
						label: 'timestamped resolver record observations',
					},
				],
			},
			{
				label: 'Name',
				items: [
					{
						label: 'parent ENS name',
					},
				],
			},
			{
				label: 'Resolver evidence',
				items: [
					{
						label: 'resolver selector/call context',
					},
				],
			},
			{
				label: 'Display',
				items: [
					{
						label: 'typed rendering for addr/text/contenthash/ABI/multicoin records',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.EnsRecord>
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
	entityType={EntityType.EnsRecord}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
