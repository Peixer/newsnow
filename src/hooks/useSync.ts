import type { PrimitiveMetadata } from "@shared/types"
import { useDebounce, useMount } from "react-use"
import { useLogin } from "./useLogin"
import { useToast } from "./useToast"
import { safeParseString } from "~/utils"

async function uploadMetadata(metadata: PrimitiveMetadata) {
  const jwt = safeParseString(localStorage.getItem("jwt"))
  if (!jwt) return
  await myFetch("/me/sync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: {
      data: metadata.data,
      updatedTime: metadata.updatedTime,
    },
  })
}

async function downloadMetadata(): Promise<PrimitiveMetadata | undefined> {
  const jwt = safeParseString(localStorage.getItem("jwt"))
  if (!jwt) return
  const { data, updatedTime } = await myFetch("/me/sync", {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  }) as PrimitiveMetadata
  // Don't need to sync the action field
  if (data) {
    return {
      action: "sync",
      data,
      updatedTime,
    }
  }
}

export function useSync() {
  const [primitiveMetadata, setPrimitiveMetadata] = useAtom(primitiveMetadataAtom)
  const { logout, login } = useLogin()
  const toaster = useToast()

  useDebounce(async () => {
    const fn = async () => {
      try {
        await uploadMetadata(primitiveMetadata)
      } catch (e: any) {
        if (e.statusCode !== 506) {
          toaster("Authentication failed, cannot sync, please login again", {
            type: "error",
            action: {
              label: "Login",
              onClick: login,
            },
          })
          logout()
        }
      }
    }

    if (primitiveMetadata.action === "manual") {
      fn()
    }
  }, 10000, [primitiveMetadata])
  useMount(() => {
    const fn = async () => {
      try {
        const metadata = await downloadMetadata()
        if (metadata) {
          setPrimitiveMetadata(preprocessMetadata(metadata))
        }
      } catch (e: any) {
        if (e.statusCode !== 506) {
          toaster("Authentication failed, cannot sync, please login again", {
            type: "error",
            action: {
              label: "Login",
              onClick: login,
            },
          })
          logout()
        }
      }
    }
    fn()
  })
}
