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
		'$association',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$association',
				'timestampMs',
				'source',
				'associationStatus',
				'balance',
				'kycStatus',
				'freezeStatus',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Association',
				items: [
					{
						label: 'parent account/token association',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'Hedera account through association',
					},
				],
			},
			{
				label: 'Token',
				items: [
					{
						label: 'Hedera token through association',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account-token relationship payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTokenAssociation_Timestamp>
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
	entityType={EntityType.HederaTokenAssociation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
