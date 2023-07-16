import React from "react";

let _hasUnsavedChanges = false;
export function dirtyNavigation(isDirty: boolean) {
  _hasUnsavedChanges = isDirty;
}

export function usePreventDirtyNav() {
  React.useEffect(() => {
    window.addEventListener('beforeunload', (e) => {
      if (_hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    });
  });
}