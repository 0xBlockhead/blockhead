import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const snapchainGet = vi.hoisted(() => vi.fn())

vi.mock('$/sources/Snapchain/Rest/client.ts', () => ({
	snapchainGet,
}))

const {
	getCastById,
	getCastsByFid,
	getFids,
	getLinksByFid,
	getLinksByTargetFid,
	getOnChainIdRegisterEventsByFid,
	getReactionsByCast,
	getUserDataByFid,
	getUsernameProofsByFid,
	getVerificationsByFid,
} = await import('$/sources/Snapchain/Rest/queries.ts')

beforeEach(() => {
	snapchainGet.mockReset()
})

describe('Snapchain Rest arktype envelopes', () => {
	it('accepts official cast / reaction / link / verification / proof / on-chain envelopes', async () => {
		snapchainGet
			.mockResolvedValueOnce({
				data: {
					type: 'MESSAGE_TYPE_CAST_ADD',
					fid: 1,
					timestamp: 100,
					network: 'FARCASTER_NETWORK_MAINNET',
					castAddBody: {
						text: 'hi',
						mentions: [2],
						mentionsPositions: [0],
						embedsDeprecated: [],
						embeds: [{
							url: 'https://example.com',
						}],
					},
				},
				hash: '0x1111111111111111111111111111111111111111',
				hashScheme: 'HASH_SCHEME_BLAKE3',
				signature: 'sig',
				signatureScheme: 'SIGNATURE_SCHEME_ED25519',
				signer: '0xabc',
			})
			.mockResolvedValueOnce({
				messages: [{
					hash: '0x2222222222222222222222222222222222222222',
					data: {
						type: 'MESSAGE_TYPE_CAST_ADD',
						fid: 1,
						timestamp: 101,
						castAddBody: { text: '' },
					},
				}],
				nextPageToken: 'opaque/+%',
			})
			.mockResolvedValueOnce({
				fids: [1, 2],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						type: 'MESSAGE_TYPE_LINK_ADD',
						fid: 9,
						timestamp: 200,
						network: 'FARCASTER_NETWORK_MAINNET',
						linkBody: {
							type: 'follow',
							targetFid: 1,
							displayTimestamp: 199,
						},
					},
					hash: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
				}],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						type: 'MESSAGE_TYPE_LINK_ADD',
						fid: 1,
						timestamp: 201,
						linkBody: {
							type: 'follow',
							targetFid: 3,
						},
					},
				}],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						type: 'MESSAGE_TYPE_USER_DATA_ADD',
						fid: 1,
						timestamp: 300,
						userDataBody: {
							type: 'USER_DATA_TYPE_BIO',
							value: 'bio',
						},
					},
					hash: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
				}],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						type: 'MESSAGE_TYPE_REACTION_ADD',
						fid: 4,
						timestamp: 400,
						reactionBody: {
							type: 'REACTION_TYPE_LIKE',
							targetCastId: {
								fid: 1,
								hash: '0x1111111111111111111111111111111111111111',
							},
						},
					},
					hash: '0xcccccccccccccccccccccccccccccccccccccccc',
				}],
			})
			.mockResolvedValueOnce({
				messages: [{
					data: {
						type: 'MESSAGE_TYPE_VERIFICATION_ADD_ADDRESS',
						fid: 1,
						timestamp: 500,
						verificationAddAddressBody: {
							address: '0x91031dcfdea024b4d51e775486111d2b2a715871',
							protocol: 'PROTOCOL_ETHEREUM',
							blockHash: '0xd74860c4bbf574d5ad60f03a478a30f990e05ac723e138a5c860cdb3095f4296',
							claimSignature: 'sig',
						},
					},
				}, {
					data: {
						type: 'MESSAGE_TYPE_VERIFICATION_ADD_ETH_ADDRESS',
						fid: 1,
						timestamp: 501,
						verificationAddEthAddressBody: {
							address: '0x91031dcfdea024b4d51e775486111d2b2a715871',
							ethSignature: 'ethsig',
							blockHash: '0xd74860c4bbf574d5ad60f03a478a30f990e05ac723e138a5c860cdb3095f4296',
						},
					},
				}],
			})
			.mockResolvedValueOnce({
				proofs: [{
					timestamp: 1623910393,
					name: 'alice',
					owner: '0x4114e33eb831858649ea3702e1c9a2db3f626446',
					signature: 'proofsig',
					fid: 1,
					type: 'USERNAME_TYPE_FNAME',
				}],
			})
			.mockResolvedValueOnce({
				events: [{
					type: 'EVENT_TYPE_ID_REGISTER',
					chainId: 10,
					blockNumber: 108874508,
					blockHash: '0x20d83804a26247ad8c26d672f2212b28268d145b8c1cefaa4126f7768f46682e',
					blockTimestamp: 1693347793,
					transactionHash: '0xf3481fc32227fbd982b5f30a87be32a2de1fc5736293cae7c3f169da48c3e764',
					logIndex: 7,
					txIndex: 0,
					fid: 1,
					idRegisterEventBody: {
						to: '0x74232bf61e994655592747e20bdf6fa9b9476f79',
						eventType: 'ID_REGISTER_EVENT_TYPE_REGISTER',
						from: '0x',
						recoveryAddress: '0x00000000fcd5a8e45785c8a4b9a718c9348e4f18',
					},
				}],
			})

		await expect(getCastById({
			fid: 1,
			hash: '0x1111111111111111111111111111111111111111',
		})).resolves.toMatchObject({
			hash: '0x1111111111111111111111111111111111111111',
			data: {
				fid: 1,
				castAddBody: {
					mentions: [2],
					mentionsPositions: [0],
				},
			},
			hashScheme: 'HASH_SCHEME_BLAKE3',
		})
		await expect(getCastsByFid({ fid: 1 })).resolves.toMatchObject({
			nextPageToken: 'opaque/+%',
		})
		await expect(getFids()).resolves.toEqual({ fids: [1, 2] })
		await expect(getLinksByTargetFid({ targetFid: 1 })).resolves.toMatchObject({
			messages: [{
				data: {
					fid: 9,
					linkBody: {
						targetFid: 1,
						displayTimestamp: 199,
					},
				},
			}],
		})
		await expect(getLinksByFid({ fid: 1 })).resolves.toMatchObject({
			messages: [{ data: { fid: 1 } }],
		})
		await expect(getUserDataByFid({ fid: 1 })).resolves.toMatchObject({
			messages: [{ data: { fid: 1 } }],
		})
		await expect(getReactionsByCast({
			targetFid: 1,
			targetHash: '0x1111111111111111111111111111111111111111',
			reactionType: 'Like',
		})).resolves.toMatchObject({
			messages: [{
				data: {
					reactionBody: {
						type: 'REACTION_TYPE_LIKE',
					},
				},
			}],
		})
		await expect(getVerificationsByFid({ fid: 1 })).resolves.toMatchObject({
			messages: [
				{
					data: {
						verificationAddAddressBody: {
							protocol: 'PROTOCOL_ETHEREUM',
						},
					},
				},
				{
					data: {
						verificationAddEthAddressBody: {
							address: '0x91031dcfdea024b4d51e775486111d2b2a715871',
						},
					},
				},
			],
		})
		await expect(getUsernameProofsByFid({ fid: 1 })).resolves.toMatchObject({
			proofs: [{
				name: 'alice',
				type: 'USERNAME_TYPE_FNAME',
			}],
		})
		await expect(getOnChainIdRegisterEventsByFid({ fid: 1 })).resolves.toMatchObject({
			events: [{
				idRegisterEventBody: {
					to: '0x74232bf61e994655592747e20bdf6fa9b9476f79',
					recoveryAddress: '0x00000000fcd5a8e45785c8a4b9a718c9348e4f18',
				},
			}],
		})
		expect(snapchainGet.mock.calls.map((call) => call[0])).toEqual([
			'/v1/castById',
			'/v1/castsByFid',
			'/v1/fids',
			'/v1/linksByTargetFid',
			'/v1/linksByFid',
			'/v1/userDataByFid',
			'/v1/reactionsByCast',
			'/v1/verificationsByFid',
			'/v1/userNameProofsByFid',
			'/v1/onChainEventsByFid',
		])
	})

	it('fail-closes malformed cast / fids / reaction / verification / link envelopes', async () => {
		snapchainGet.mockResolvedValueOnce({ hash: 12 })
		await expect(getCastById({
			fid: 1,
			hash: '0x1111111111111111111111111111111111111111',
		})).rejects.toThrow('Snapchain_Rest: invalid cast response envelope')

		snapchainGet.mockResolvedValueOnce({ fids: ['1'] })
		await expect(getFids()).rejects.toThrow(
			'Snapchain_Rest: invalid fids response envelope'
		)

		snapchainGet.mockResolvedValueOnce({
			messages: [{
				data: {
					fid: 1,
					reactionBody: {
						type: true,
					},
				},
			}],
		})
		await expect(getReactionsByCast({
			targetFid: 1,
			targetHash: '0x1111111111111111111111111111111111111111',
			reactionType: 'Like',
		})).rejects.toThrow('Snapchain_Rest: invalid reactions-by-cast response envelope')

		snapchainGet.mockResolvedValueOnce({
			messages: [{
				data: {
					fid: 1,
					verificationAddAddressBody: {
						chainId: 'mainnet',
					},
				},
			}],
		})
		await expect(getVerificationsByFid({ fid: 1 })).rejects.toThrow(
			'Snapchain_Rest: invalid verifications response envelope'
		)

		snapchainGet.mockResolvedValueOnce({
			messages: [{
				data: {
					fid: 1,
					linkBody: {
						targetFid: '2',
					},
				},
			}],
		})
		await expect(getLinksByFid({ fid: 1 })).rejects.toThrow(
			'Snapchain_Rest: invalid links-by-fid response envelope'
		)
	})
})
