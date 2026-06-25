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
		'mintUrl',
		'name',
		'pubkey',
	],
	content: {
		dl: [
			[
				'mintUrl',
				'name',
				'pubkey',
				'version',
				{
					label: 'server time',
				},
			],
			[
				'$$keysets',
				'motd',
				{
					label: 'icon/TOS availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Keysets',
				items: [
					{
						label: 'public CashuKeyset rows',
					},
				],
			},
			{
				label: 'Operator metadata',
				items: [
					'name',
					'description',
					'motd',
					{
						label: 'icon',
					},
					{
						label: 'TOS',
					},
				],
			},
			{
				label: 'Capability target',
				items: [
					{
						label: 'CashuMint_Timestamp when timestamp schema exists',
					},
				],
			},
			{
				label: 'Endpoint/source',
				items: [
					{
						label: 'normalized endpoint URL',
					},
					{
						label: 'source freshness',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'keysets',
			label: 'keysets',
			field: '$$keysets',
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
			selection: EntityProxyResource<typeof schema, EntityType.CashuMint>
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
	entityType={EntityType.CashuMint}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
