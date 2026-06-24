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
			label: 'keyset',
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
					label: 'keyset',
				},
				{
					label: 'observation time',
				},
				'source',
				{
					label: 'active state',
				},
				{
					label: 'input fee ppk',
				},
				{
					label: 'final expiry',
				},
			],
			[
				{
					label: 'keys-endpoint listing flag',
				},
				{
					label: 'keysets-endpoint listing flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Keyset',
				items: [
					{
						label: 'parent Cashu keyset',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'parent Cashu mint',
					},
				],
			},
			{
				label: 'Rotation/economics',
				items: [
					{
						label: 'active/final-expiry/input-fee changes',
					},
				],
			},
			{
				label: 'Endpoint coverage',
				items: [
					{
						label: 'keys endpoint listing',
					},
					{
						label: 'keysets endpoint listing',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'GET /v1/keys',
					},
					{
						label: 'GET /v1/keys/{keyset_id}',
					},
					{
						label: 'GET /v1/keysets',
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
			selection: EntityProxyResource<typeof schema, EntityType.CashuKeyset_Timestamp>
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
	entityType={EntityType.CashuKeyset_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
