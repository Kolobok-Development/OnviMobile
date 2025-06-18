#!/bin/sh

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
ENV_FILE="$PROJECT_ROOT/.env"
INFO_PLIST_FILE="$PROJECT_ROOT/ios/OnviMobile/Info.plist"

echo "PROJECT_ROOT=$PROJECT_ROOT"
echo "ENV_FILE=$ENV_FILE"
echo "INFO_PLIST_FILE=$INFO_PLIST_FILE"

[ -f "$ENV_FILE" ] || { echo "Error: .env file not found"; exit 1; }
set -a
. "$ENV_FILE"
set +a

[ -f "$INFO_PLIST_FILE" ] || { echo "Error: Info.plist not found"; exit 1; }

/usr/libexec/PlistBuddy -c "Set :APP_VERSION $APP_VERSION" "$INFO_PLIST_FILE" || exit 1
/usr/libexec/PlistBuddy -c "Set :IOS_VERSION_CODE $IOS_VERSION_CODE" "$INFO_PLIST_FILE" || exit 1
/usr/libexec/PlistBuddy -c "Set :IOS_VERSION_NAME $IOS_VERSION_NAME" "$INFO_PLIST_FILE" || exit 1

echo "Info.plist updated successfully"