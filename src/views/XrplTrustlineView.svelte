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
			'account',
			'currency',
			'issuer',
		],
		content: {
			dl: [
				[
					'account',
					'currency',
					'issuer',
					{
						label: 'latest balance/limit flags',
					},
					{
						label: 'account/issuer links',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Snapshots',
					items: [
						{
							label: 'ledger-indexed trustline observations',
						},
					],
				},
				{
					label: 'Ledger entry',
					items: [
						{
							label: 'RippleState ledger object when known',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplTrustline>
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
	entityType={EntityType.XrplTrustline}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
