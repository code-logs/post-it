import React, { KeyboardEvent, useCallback, useEffect, useState } from 'react'
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import '../../styles/setting.scss'
import { Snippet } from '../../types'
import { generateSampleSnippet } from '../../utils/generate-snippet'
import SnippetEditor from '../SnippetEditor/SnippetEditor'

export interface SettingProps {
  snippets: Snippet[]
  onSnippetsChangeHandler: (snippets: Snippet[]) => void
  onCloseHandler: () => void
}

const Setting = ({
  snippets,
  onSnippetsChangeHandler,
  onCloseHandler,
}: SettingProps) => {
  const [visibility, setVisibility] = useState(false)

  useEffect(() => {
    setVisibility(true)
  }, [])

  const closeModal = useCallback(() => {
    setVisibility(false)
  }, [])

  const [toggledSnippetKey, setToggledSnippetKey] = useState<string | null>(
    null
  )

  const checkSnippetDuplication = (snippet: Snippet) => {
    if (snippets.some(({ key }) => key === snippet.key)) {
      throw new Error(
        `Snippet which has ${snippet.key} as its key already exists`
      )
    }
  }

  const addSnippet = (snippet: Snippet) => {
    onSnippetsChangeHandler([...snippets, snippet])
  }

  const deleteSnippet = (targetSnippetKey: Snippet['key']) => {
    onSnippetsChangeHandler(
      snippets.filter(({ key }) => key !== targetSnippetKey)
    )
  }

  return (
    <section
      id="snippeter-setting"
      className={visibility ? 'visible' : undefined}
      onKeyUp={(event: KeyboardEvent<HTMLElement>) => {
        if (event.code === 'Escape') {
          setVisibility(false)
        }
      }}
      onTransitionEnd={() => {
        if (!visibility) onCloseHandler()
      }}
    >
      <div id="modal" onClick={closeModal}></div>

      <div id="setting">
        <header className="main-header">
          <h1 className="title">Setting</h1>
          <button id="close-button" type="button" onClick={closeModal}>
            <CloseIcon />
          </button>
        </header>

        <section id="snippets">
          <header>
            <h2 className="subtitle">My Snippets</h2>
          </header>

          {snippets.length ? (
            <ul id="my-snippet-list">
              {snippets.map((snippet) => {
                const { key } = snippet

                return (
                  <li className="my-snippet-list-item" key={key}>
                    {generateSampleSnippet(snippet)}
                    {key === toggledSnippetKey ? (
                      <button
                        className="button"
                        type="button"
                        onClick={() => {
                          setToggledSnippetKey(null)
                        }}
                      >
                        <ExpandLessIcon />
                      </button>
                    ) : (
                      <button
                        className="button"
                        type="button"
                        onClick={() => {
                          setToggledSnippetKey(key)
                        }}
                      >
                        <ExpandMoreIcon />
                      </button>
                    )}
                    <button
                      className="button delete-button"
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure to delete ${key} snippet?`)) {
                          deleteSnippet(key)
                          setToggledSnippetKey(null)
                        }
                      }}
                    >
                      <DeleteIcon />
                    </button>

                    {key === toggledSnippetKey && (
                      <SnippetEditor
                        snippet={snippets.find(
                          ({ key }) => key === toggledSnippetKey
                        )}
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div id="no-snippet-message">
              <strong>
                <em>No Snippet Found!</em>
              </strong>
              <span>You can register your own snippet.</span>
            </div>
          )}
        </section>

        <section id="add-snippet">
          <header>
            <h2 className="subtitle">Add Snippets</h2>
          </header>
          <SnippetEditor
            actionTitle="Save"
            onActionClickHandler={(snippet) => {
              try {
                checkSnippetDuplication(snippet)
                addSnippet(snippet)
              } catch (e) {
                if (e instanceof Error) {
                  alert(e.message)
                } else {
                  alert('Unexpected error is occurred')
                }
              }
            }}
          />
        </section>
      </div>
    </section>
  )
}

export default Setting
