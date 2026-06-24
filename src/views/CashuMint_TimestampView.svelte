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
			label: 'mint',
		},
		{
			label: 'observation time',
		},
		'source',
	],
	content: {
		dl: [
			[
				{
					label: 'mint',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'reachability',
				},
				{
					label: 'server time',
				},
				'version',
				'pubkey',
			],
			[
				{
					label: 'supported NUT count',
				},
				{
					label: 'mint method summary',
				},
				{
					label: 'melt method summary',
				},
				{
					label: 'contact/url availability',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Mint',
				items: [
					{
						label: 'parent Cashu mint',
					},
				],
			},
			{
				label: 'Operator metadata',
				items: [
					'name',
					{
						label: 'descriptions',
					},
					{
						label: 'icon',
					},
					{
						label: 'TOS',
					},
					'contactJson',
					'urls',
				],
			},
			{
				label: 'Capabilities',
				items: [
					'supportedNutNumbers',
					'mintMethodsJson',
					'meltMethodsJson',
					'nutsJson',
				],
			},
			{
				label: 'Keysets',
				items: [
					{
						label: 'public keysets advertised by the mint',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'GET /v1/info response',
					},
					{
						label: 'fetch status',
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
			selection: EntityProxyResource<typeof schema, EntityType.CashuMint_Timestamp>
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
	entityType={EntityType.CashuMint_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
