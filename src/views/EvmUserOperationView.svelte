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
			'hash',
			{
				label: 'success',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					'hash',
					{
						label: 'success',
					},
					{
						label: 'bundled block',
					},
					{
						label: 'timestamp',
					},
					'fee',
					'nonce',
					{
						label: 'EntryPoint version',
					},
					{
						label: 'EntryPoint',
					},
					{
						label: 'sender',
					},
					{
						label: 'paymaster',
					},
					{
						label: 'bundler',
					},
					{
						label: 'sponsor type',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Bundle',
					items: [
						{
							label: 'bundled EVM transaction and block',
						},
					],
				},
				{
					label: 'Participants',
					items: [
						{
							label: 'smart account',
						},
						{
							label: 'paymaster',
						},
						{
							label: 'bundler',
						},
						{
							label: 'EntryPoint contract',
						},
					],
				},
				{
					label: 'Gas & fees',
					items: [
						{
							label: 'call/verification/pre-verification gas',
						},
						{
							label: 'max fee',
						},
						{
							label: 'priority fee',
						},
						{
							label: 'gas/gasUsed/gasPrice',
						},
						'fee',
					],
				},
				{
					label: 'Payloads',
					items: [
						'initCode',
						'callData',
						'paymasterAndData',
						'signature',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Blockscout operation detail/list payload',
						},
						{
							label: 'pagination or transaction filter context',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmUserOperation>
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
	entityType={EntityType.EvmUserOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
