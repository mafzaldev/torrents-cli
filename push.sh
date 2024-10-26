#!/bin/bash

git checkout release
git merge main
echo "Merging main into release"
git push origin main release
echo "Pushing main and release to origin"
git checkout main