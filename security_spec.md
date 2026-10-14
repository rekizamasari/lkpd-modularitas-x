# Security Specification for LKPD Modularitas Python

## 1. Data Invariants
1. `groups/{groupId}`:
   - `id` in document path must match `groupId` and adhere to `^[a-zA-Z0-9_\-]+$` with max size 128 bytes.
   - `identity` must be an object with valid `kelompok` name, school name, and members array (`anggota.size() <= 20`).
   - `teacherFeedback` cannot exceed 2000 characters.
   - `teacherName` cannot exceed 128 characters.
   - `updatedAt` is required and limited to 64 chars.
2. `settings/{settingId}`:
   - `settingId` must be a valid identifier (e.g., 'teacher').
   - `pin` must be a string between 4 and 32 characters.

## 2. Dirty Dozen Payloads (Designed to Fail Validation)
1. Missing `id` field in group payload.
2. Path mismatch where `id != groupId`.
3. Excessively long `groupId` (> 128 chars).
4. `groupId` with invalid shell or SQL characters (`../../etc/passwd`).
5. Missing `identity` object.
6. `anggota` list exceeding 20 members (Denial of Wallet).
7. `teacherFeedback` string exceeding 2000 characters.
8. `teacherName` exceeding 128 characters.
9. `pin` in `settings/teacher` less than 4 characters.
10. `pin` in `settings/teacher` exceeding 32 characters.
11. Injection of unrecognized root collection `/system_secrets/{id}`.
12. Malformed non-string `updatedAt` field.

## 3. Test Runner
All payloads tested against Firestore security rules ensure strict schema compliance and boundary guards.
