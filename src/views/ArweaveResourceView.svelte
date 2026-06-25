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
		'canonicalUri',
		{
			label: 'latest gateway origin',
		},
		{
			label: 'latest content type',
		},
	],
	content: {
		dl: [
			[
				'canonicalUri',
				'transactionId',
				'contentPath',
				'$transaction',
				{
					label: 'latest gateway/source',
				},
			],
			[
				{
					label: 'latest content type',
				},
				{
					label: 'latest content length',
				},
				{
					label: 'latest display type',
				},
				{
					label: 'latest inferred-content-type status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Address',
				items: [
					'transactionId',
					'contentPath',
					{
						label: 'linked Arweave transaction when resolved',
					},
				],
			},
			{
				label: 'Latest retrieval',
				items: [
					{
						label: 'latest gateway retrieval observation',
					},
				],
			},
			{
				label: 'Retrieval history',
				items: [
					{
						label: 'timestamped gateway/source observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'gateway headers',
					},
					{
						label: 'content-type inference',
					},
					{
						label: 'payload availability',
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
			selection: EntityProxyResource<typeof schema, EntityType.ArweaveResource>
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
	entityType={EntityType.ArweaveResource}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
