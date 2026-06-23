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
				label: 'authentication id',
			},
			'protocol',
			'verified',
		],
		content: {
			dl: [
				[
					{
						label: 'authentication id',
					},
					'protocol',
					'domain',
					{
						label: 'URI',
					},
					{
						label: 'chain/account',
					},
					{
						label: 'issued/expiration/not-before times',
					},
				],
				[
					{
						label: 'nonce presence',
					},
					{
						label: 'signature presence',
					},
					'verified',
					{
						label: 'verified at',
					},
					'error',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Connection',
					items: [
						{
							label: 'BlockheadWalletConnection if auth was performed through a live wallet',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'BlockheadWalletAccount',
						},
					],
				},
				{
					label: 'Statement',
					items: [
						{
							label: 'redacted sign-in statement',
						},
					],
				},
				{
					label: 'Verification',
					items: [
						{
							label: 'nonce/domain/signature verification result',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWalletAuthentication>
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
	entityType={EntityType.BlockheadWalletAuthentication}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
