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
			label: 'account',
		},
		{
			label: 'latest interface observation',
		},
		{
			label: 'verification observation',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'account',
				},
				{
					label: 'latest interface kind/wallet version observation',
				},
				{
					label: 'latest code hash',
				},
				{
					label: 'verification status',
				},
				{
					label: 'verified source URL',
				},
				{
					label: 'get-method/message windows',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account state',
				items: [
					{
						label: 'linked account',
					},
					{
						label: 'account state snapshots',
					},
				],
			},
			{
				label: 'Contract observations',
				items: [
					{
						label: 'interface and verification snapshots',
					},
				],
			},
			{
				label: 'Get methods',
				items: [
					{
						label: 'callable get-method rows',
					},
				],
			},
			{
				label: 'Source verification',
				items: [
					{
						label: 'verified source URL',
					},
					{
						label: 'verifier payload',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'related TON messages',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'account-local transactions',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonContract>
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
	entityType={EntityType.TonContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
