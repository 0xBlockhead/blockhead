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
		'drepCredential',
		'credentialKind',
		{
			label: 'latest registration state',
		},
	],
	content: {
		dl: [
			[
				'drepCredential',
				'credentialKind',
				{
					label: 'latest registration state',
				},
				{
					label: 'latest deposit',
				},
				{
					label: 'latest anchor URL/hash',
				},
			],
			[
				{
					label: 'latest voting power',
				},
				'$$votes',
				{
					label: 'latest observation',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped DRep state observations',
					},
				],
			},
			{
				label: 'Votes',
				items: [
					{
						label: 'governance votes by this DRep',
					},
				],
			},
			{
				label: 'Delegators',
				items: [
					{
						label: 'stake credentials delegated to this DRep when sourceable',
					},
				],
			},
			{
				label: 'Anchor',
				items: [
					{
						label: 'off-chain anchor metadata evidence from latest timestamp',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cardano network',
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
		{
			id: 'votes',
			label: 'votes',
			field: '$$votes',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoDRep>
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
	entityType={EntityType.CardanoDRep}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
