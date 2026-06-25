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
		'$contract',
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$contract',
				'timestampMs',
				'source',
				'interfaceKind',
				'walletVersion',
			],
			[
				'codeHash',
				'verification',
				'verifiedSourceUrl',
				{
					label: 'verified time',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent contract identity',
					},
				],
			},
			{
				label: 'Account state',
				items: [
					{
						label: 'account-state snapshot near the same source time',
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
				label: 'Verifier payload',
				items: [
					{
						label: 'source URL',
					},
					{
						label: 'verification status',
					},
					{
						label: 'compiler/build evidence when exposed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'TonAPI/TonCenter/verifier contract payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonContract_Timestamp>
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
	entityType={EntityType.TonContract_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
