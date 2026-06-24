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
		{
			label: 'network',
		},
		{
			label: 'item address',
		},
		{
			label: 'collection',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'item address',
				},
				{
					label: 'collection',
				},
				{
					label: 'item index',
				},
				{
					label: 'account',
				},
				{
					label: 'latest owner/initialized/metadata observation',
				},
				{
					label: 'transfer/timestamp windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest item-state observation',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'item-state observation history',
					},
				],
			},
			{
				label: 'Collection',
				items: [
					{
						label: 'parent collection identity',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'item contract account',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'decoded item transfer effects',
					},
				],
			},
			{
				label: 'Metadata/content',
				items: [
					{
						label: 'latest metadata fields',
					},
					{
						label: 'URI evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonNftItem>
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
	entityType={EntityType.TonNftItem}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
