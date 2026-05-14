"use client";
import { useState, useMemo } from "react";
import { useToastCtx } from "../../components/layout/Layout";
import DataTable, { Column } from "../../components/common/DataTable";
import { useMenuAll, useMenuRegister, useMenuUpdate, useMenuDelete } from "../../lib/api/hooks/useMenus";
import type { Menu, MenuRegisterRequest, MenuUpdateRequest } from "@/types";

const ICON_OPTIONS = [
  { value: 'dashboard', label: '대시보드' },
  { value: 'groups', label: '그룹' },
  { value: 'devices', label: '단말기' },
  { value: 'policies', label: '정책' },
  { value: 'pauses', label: '탐지중단' },
  { value: 'detections', label: '탐지' },
  { value: 'users', label: '직원' },
  { value: 'licenses', label: '라이선스' },
  { value: 'notifications', label: '알림' },
  { value: 'account', label: '계정' },
  { value: 'components', label: '컴포넌트' },
];

type ModalTab = 'section' | 'submenu';

interface MenuFormData {
  title: string;
  path: string;
  icon: string;
  parentId: number | null;
  depth: number;
  sortingOrder: number;
}

const initialSectionForm: MenuFormData = {
  title: '',
  path: '',
  icon: '',
  parentId: null,
  depth: 0,
  sortingOrder: 1,
};

const initialSubmenuForm: MenuFormData = {
  title: '',
  path: '',
  icon: '',
  parentId: null,
  depth: 1,
  sortingOrder: 1,
};

export default function MenuAdmin() {
  const toast = useToastCtx();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>('section');
  const [formData, setFormData] = useState<MenuFormData>(initialSectionForm);
  const [sortingOrderInput, setSortingOrderInput] = useState('1');

  const { data, isLoading, refetch } = useMenuAll();
  const registerMutation = useMenuRegister();
  const updateMutation = useMenuUpdate();
  const deleteMutation = useMenuDelete();

  const rawMenus = data?.data ?? [];

  // API가 이미 계층 구조로 반환하므로, 플랫하게 변환
  const menus = useMemo(() => {
    const result: Menu[] = [];
    for (const parent of rawMenus) {
      result.push(parent);
      if (parent.children && parent.children.length > 0) {
        result.push(...parent.children);
      }
    }
    return result;
  }, [rawMenus]);

  const parentMenus = useMemo(() => menus.filter(m => m.depth === 0), [menus]);

  // 테이블 표시용 - 대메뉴 아래에 하위메뉴를 정렬하여 표시
  const sortedMenusForTable = useMemo(() => {
    const sorted = [...menus].sort((a, b) => a.sortingOrder - b.sortingOrder);
    const parents = sorted.filter(m => m.depth === 0);
    const children = sorted.filter(m => m.depth === 1);
    
    const result: Menu[] = [];
    for (const parent of parents) {
      result.push(parent);
      const childrenOfParent = children.filter(c => c.parentId === parent.id);
      result.push(...childrenOfParent);
    }
    // 부모가 없는 하위메뉴도 표시
    const orphans = children.filter(c => !parents.some(p => p.id === c.parentId));
    result.push(...orphans);
    
    return result;
  }, [menus]);

  const cols: Column<Menu & Record<string, unknown>>[] = useMemo(
    () => [
      {
        key: "id",
        label: "ID",
        render: (v) => (
          <span style={{ fontFamily: "monospace", color: "var(--t2)" }}>
            {v as number}
          </span>
        ),
      },
      {
        key: "title",
        label: "메뉴명",
        render: (v, row) => {
          const menu = row as Menu;
          const indent = menu.depth === 1 ? '└ ' : '';
          return (
            <span style={{ fontWeight: menu.depth === 0 ? 600 : 400, color: "var(--t1)" }}>
              {indent}{v as string}
            </span>
          );
        },
      },
      {
        key: "depth",
        label: "구분",
        render: (v) => (
          <span style={{ 
            fontSize: 11, 
            padding: '2px 8px', 
            borderRadius: 4,
            background: (v as number) === 0 ? '#dbeafe' : '#f3e8ff',
            color: (v as number) === 0 ? '#1d4ed8' : '#7c3aed',
          }}>
            {(v as number) === 0 ? '대메뉴' : '하위메뉴'}
          </span>
        ),
      },
      {
        key: "parentId",
        label: "상위메뉴",
        render: (v, row) => {
          const menu = row as Menu;
          if (menu.depth === 0) return <span style={{ color: "var(--t3)" }}>-</span>;
          const parent = menus.find(m => m.id === v);
          return (
            <span style={{ fontSize: 12, color: "var(--t2)" }}>
              {parent ? parent.title : '-'}
            </span>
          );
        },
      },
      {
        key: "path",
        label: "경로",
        render: (v) => (
          <code style={{ 
            background: "var(--bg3)", 
            padding: "2px 6px", 
            borderRadius: 4,
            fontSize: 12 
          }}>
            {v as string}
          </code>
        ),
      },
      {
        key: "icon",
        label: "아이콘",
        render: (v) => (
          <span style={{ fontSize: 12, color: "var(--t2)" }}>
            {v ? (v as string) : '-'}
          </span>
        ),
      },
      {
        key: "sortingOrder",
        label: "정렬순서",
        render: (v) => `${v}`,
      },
    ],
    [menus]
  );

  const handleOpenModal = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu);
      setModalTab(menu.depth === 0 ? 'section' : 'submenu');
      setFormData({
        title: menu.title,
        path: menu.path || '',
        icon: menu.icon || '',
        parentId: menu.parentId,
        depth: menu.depth,
        sortingOrder: menu.sortingOrder,
      });
      setSortingOrderInput(String(menu.sortingOrder));
    } else {
      setEditingMenu(null);
      setModalTab('section');
      setFormData(initialSectionForm);
      setSortingOrderInput('1');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    setModalTab('section');
    setFormData(initialSectionForm);
    setSortingOrderInput('1');
  };

  const handleTabChange = (tab: ModalTab) => {
    if (editingMenu) return;
    setModalTab(tab);
    setFormData(tab === 'section' ? initialSectionForm : initialSubmenuForm);
    setSortingOrderInput('1');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast("메뉴명은 필수입니다.", "error");
      return;
    }

    if (formData.depth === 1 && !formData.parentId) {
      toast("하위메뉴는 상위메뉴를 선택해야 합니다.", "error");
      return;
    }

    if (formData.depth === 1 && !formData.path) {
      toast("하위메뉴는 경로가 필수입니다.", "error");
      return;
    }

    try {
      if (editingMenu) {
        // 수정 시
        const updateData: MenuUpdateRequest = formData.depth === 0
          ? {
              menuId: editingMenu.id,
              title: formData.title,
              depth: formData.depth,
              sortingOrder: formData.sortingOrder,
            }
          : {
              menuId: editingMenu.id,
              title: formData.title,
              path: formData.path,
              icon: formData.icon || undefined,
              parentId: formData.parentId,
              depth: formData.depth,
              sortingOrder: formData.sortingOrder,
            };
        await updateMutation.mutateAsync(updateData);
        toast("메뉴가 수정되었습니다.", "success");
      } else {
        // 등록 시
        const registerData: MenuRegisterRequest = formData.depth === 0
          ? {
              title: formData.title,
              depth: formData.depth,
              sortingOrder: formData.sortingOrder,
            }
          : {
              title: formData.title,
              path: formData.path,
              icon: formData.icon || undefined,
              parentId: formData.parentId,
              depth: formData.depth,
              sortingOrder: formData.sortingOrder,
            };
        await registerMutation.mutateAsync(registerData);
        toast("메뉴가 등록되었습니다.", "success");
      }
      handleCloseModal();
      refetch();
    } catch {
      toast("처리 중 오류가 발생했습니다.", "error");
    }
  };

  const handleDelete = async (menuId: number) => {
    if (!confirm("정말 이 메뉴를 삭제하시겠습니까?")) return;
    
    try {
      await deleteMutation.mutateAsync(menuId);
      toast("메뉴가 삭제되었습니다.", "success");
      refetch();
    } catch {
      toast("삭제 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div>
      <div className="ph">
        <div className="ph-left">
          <div className="ph-title">메뉴 관리</div>
          <div className="ph-sub">
            총 {data?.meta?.size ?? menus.length}개 메뉴 등록됨
          </div>
        </div>
        <div className="ph-actions">
          <button
            className="btn btn-p"
            onClick={() => handleOpenModal()}
          >
            + 메뉴 추가
          </button>
        </div>
      </div>

      <DataTable
        cols={cols}
        rows={sortedMenusForTable as (Menu & Record<string, unknown>)[]}
        loading={isLoading}
        rowKey="id"
        onRowClick={(row) => handleOpenModal(row as Menu)}
        emptyMessage="등록된 메뉴가 없습니다"
        emptyIcon="📋"
        actions={(row) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-sm btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(row as Menu);
              }}
            >
              수정
            </button>
            <button
              className="btn btn-sm"
              style={{ background: '#ef4444', color: 'white' }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete((row as Menu).id);
              }}
            >
              삭제
            </button>
          </div>
        )}
      />

      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: 'var(--bg1)',
              borderRadius: 12,
              minWidth: 440,
              maxWidth: 520,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '20px 24px 0' }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {editingMenu ? '메뉴 수정' : '새 메뉴 추가'}
              </h2>
            </div>

            {!editingMenu && (
              <div style={{ 
                display: 'flex', 
                gap: 0,
                margin: '16px 24px 0',
                borderBottom: '1px solid var(--bd)',
              }}>
                <button
                  type="button"
                  onClick={() => handleTabChange('section')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: modalTab === 'section' ? '2px solid var(--ac)' : '2px solid transparent',
                    color: modalTab === 'section' ? 'var(--ac)' : 'var(--t2)',
                    fontWeight: modalTab === 'section' ? 600 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  대메뉴 (섹션)
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('submenu')}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: modalTab === 'submenu' ? '2px solid var(--ac)' : '2px solid transparent',
                    color: modalTab === 'submenu' ? 'var(--ac)' : 'var(--t2)',
                    fontWeight: modalTab === 'submenu' ? 600 : 400,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  하위메뉴
                </button>
              </div>
            )}

            {editingMenu && (
              <div style={{ 
                margin: '12px 24px 0',
                padding: '8px 12px',
                background: formData.depth === 0 ? '#dbeafe' : '#f3e8ff',
                borderRadius: 6,
                fontSize: 13,
                color: formData.depth === 0 ? '#1d4ed8' : '#7c3aed',
              }}>
                {formData.depth === 0 ? '대메뉴 (섹션)' : '하위메뉴'} 수정 중
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
              {modalTab === 'section' && formData.depth === 0 && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label 
                      htmlFor="menu-title"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      섹션명 *
                    </label>
                    <input
                      id="menu-title"
                      className="inp"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 운영 관리, 모니터링, 설정"
                      style={{ width: '100%' }}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--t3)' }}>
                      사이드바에서 메뉴를 그룹화하는 섹션 이름입니다.
                    </p>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label 
                      htmlFor="menu-order"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      정렬 순서
                    </label>
                    <input
                      id="menu-order"
                      className="inp"
                      type="text"
                      inputMode="numeric"
                      value={sortingOrderInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d+$/.test(val)) {
                          setSortingOrderInput(val);
                        }
                      }}
                      onBlur={() => {
                        const num = parseInt(sortingOrderInput, 10);
                        if (!isNaN(num) && num >= 1) {
                          setFormData({ ...formData, sortingOrder: num });
                          setSortingOrderInput(String(num));
                        } else {
                          setSortingOrderInput(String(formData.sortingOrder));
                        }
                      }}
                      style={{ width: 120 }}
                    />
                  </div>
                </>
              )}

              {(modalTab === 'submenu' || formData.depth === 1) && (
                <>
                  <div style={{ marginBottom: 16 }}>
                    <label 
                      htmlFor="menu-parent"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      소속 섹션 *
                    </label>
                    <select
                      id="menu-parent"
                      className="inp"
                      value={formData.parentId ?? ''}
                      onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number.parseInt(e.target.value) : null })}
                      style={{ width: '100%' }}
                    >
                      <option value="">섹션 선택</option>
                      {parentMenus.map((pm) => (
                        <option key={pm.id} value={pm.id}>
                          {pm.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label 
                      htmlFor="menu-title-sub"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      메뉴명 *
                    </label>
                    <input
                      id="menu-title-sub"
                      className="inp"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="예: 대시보드, 단말기 관리"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label 
                      htmlFor="menu-path"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      경로 *
                    </label>
                    <input
                      id="menu-path"
                      className="inp"
                      type="text"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      placeholder="예: /meercatch/dashboard"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label 
                      htmlFor="menu-icon"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      아이콘 <span style={{ color: 'var(--t3)', fontWeight: 400 }}>(선택)</span>
                    </label>
                    <select
                      id="menu-icon"
                      className="inp"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      style={{ width: '100%' }}
                    >
                      <option value="">아이콘 없음</option>
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label} ({opt.value})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label 
                      htmlFor="menu-order-sub"
                      style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}
                    >
                      정렬 순서
                    </label>
                    <input
                      id="menu-order-sub"
                      className="inp"
                      type="text"
                      inputMode="numeric"
                      value={sortingOrderInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^\d+$/.test(val)) {
                          setSortingOrderInput(val);
                        }
                      }}
                      onBlur={() => {
                        const num = parseInt(sortingOrderInput, 10);
                        if (!isNaN(num) && num >= 1) {
                          setFormData({ ...formData, sortingOrder: num });
                          setSortingOrderInput(String(num));
                        } else {
                          setSortingOrderInput(String(formData.sortingOrder));
                        }
                      }}
                      style={{ width: 120 }}
                    />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid var(--bd)' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-p"
                  disabled={registerMutation.isPending || updateMutation.isPending}
                >
                  {editingMenu ? '수정' : '등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
