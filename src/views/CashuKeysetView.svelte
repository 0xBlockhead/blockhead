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
				label: 'keyset id',
			},
			'unit',
		],
		content: {
			dl: [
				[
					{
						label: 'mint',
					},
					{
						label: 'keyset id',
					},
					'unit',
					{
						label: 'active state',
					},
					{
						label: 'input fee ppk',
					},
					{
						label: 'public key count',
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
					label: 'Keys',
					items: [
						{
							label: 'amount-to-public-key JSON',
						},
						{
							label: 'keyset-id verification context',
						},
					],
				},
				{
					label: 'Rotation target',
					items: [
						{
							label: 'CashuKeyset_Timestamp when timestamp schema exists',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'GET /v1/keysets',
						},
						{
							label: 'GET /v1/keys/{keyset_id}',
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
			selection: EntityProxyResource<typeof schema, EntityType.CashuKeyset>
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
	entityType={EntityType.CashuKeyset}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
